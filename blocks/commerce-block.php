<?php 

add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/products', array(
    'methods' => 'GET',
    'callback' => 'vip_commerce_get_products',
  ) );
} );

function vip_commerce_get_products() {

  $query = '
    {
      products(first: 10) {
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

register_block_type( 'vip-commerce/vip-commerce-block', array(
  'render_callback' => 'vip_commerce_render_block',
) );

function vip_commerce_render_block( $attributes ) {
  $products = vip_commerce_get_products();
  
  $output = '<div class="vip-commerce-products">';
  
  foreach ( $products['products'] as $product ) {
    $output .= '<div class="vip-commerce-product">';
    $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
    $output .= '<p>' . esc_html( $product['description'] ) . '</p>';
    $output .= '<p>$' . number_format( $product['price'], 2 ) . '</p>';
    $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 30%;" />';
    $output .= '</div>';
  }
  
  $output .= '</div>';

  return $output;
}