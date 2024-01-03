<?php 

add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/products-by-name', array(
    'methods' => 'GET',
    'callback' => function ( WP_REST_Request $request ) {
      $search_term = $request->get_param( 'search' );
      return vip_commerce_get_products_by_name( $search_term );
    },
  ) );
} );

function vip_commerce_get_products_by_name( $search_term ) {

  $query = '
    {
      products(first: 10, query: "title:' . $search_term . '") {
        edges {
          node {
            id
            title
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
          }
        }
      }
    }
  ';

  $body = call_shopify_api( $query );
  $data = json_decode( $body, true );

  $products = array_map( function( $edge ) {
    $node = $edge['node'];
    return array(
      'id' => $node['id'],
      'name' => $node['title'],
      'description' => $node['descriptionHtml'],
      'price' => $node['priceRange']['minVariantPrice']['amount'],
      'image' => $node['images']['edges'][0]['node']['originalSrc'],
    );
  }, $data['data']['products']['edges'] );

  return array( 'products' => $products );
}

function vip_commerce_get_product_by_id( $product_id ) {

  $query = '
    {
      node(id: "' . $product_id . '") {
        ... on Product {
          id
          title
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
        }
      }
    }
  ';
  $body = call_shopify_api( $query );
  $data = json_decode( $body, true );

  $node = $data['data']['node'];

  return array(
    'id' => $node['id'],
    'name' => $node['title'],
    'description' => $node['descriptionHtml'],
    'price' => $node['priceRange']['minVariantPrice']['amount'],
    'image' => $node['images']['edges'][0]['node']['originalSrc'],
  );
}

/**
 * Render function
 */

register_block_type( 'vip-commerce/vip-commerce-search-block', array(
  'render_callback' => 'vip_commerce_search_render_block',
) );

function vip_commerce_search_render_block( $attributes, $content ) {
  $selected_product_id = $attributes['selectedProduct'];

  // Fetch the product data from Shopify
  $product = vip_commerce_get_product_by_id( $selected_product_id );

  if ( ! $product ) {
    return '';
  }

  $output = '<div class="vip-commerce-product">';
  $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
  $output .= '<div>' . $product['description'] . '</div>';
  $output .= '<p>$' . number_format( $product['price'], 2 ) . '</p>';
  $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 30%;" />';
  $output .= '</div>';

  $output .= $content;

  return $output;
}