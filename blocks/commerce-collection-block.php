<?php 
namespace VIP\Commerce;

add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/collections', array(
    'methods' => 'GET',
    'callback' => 'VIP\Commerce\vip_commerce_get_collections',
    'permission_callback' => '__return_true',
  ) );
} );

function vip_commerce_get_collections() {

  $query = <<<GRAPHQL
  {
    ShopifyStorefront_collections(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
GRAPHQL;

  $data = call_mesh_api( $query );

  $collections = array_map( function( $edge ) {
    $node = $edge['node'];
    return array(
      'id' => $node['id'],
      'title' => $node['title'],
    );
  }, $data['data']['ShopifyStorefront_collections']['edges'] );

  return array( 'collections' => $collections );
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/products-by-collection', array(
    'methods' => 'GET',
    'callback' => function ( \WP_REST_Request $request ) {
      $collection = $request->get_param( 'collection' );
      return vip_commerce_get_products_by_collection( $collection );
    },
    'permission_callback' => '__return_true',
  ) );
} );

function vip_commerce_get_products_by_collection( $collectionId ) {

  $query = <<<GRAPHQL
  {
    ShopifyStorefront_collection(id:"$collectionId") {
      products(first: 50) {
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
  }
  GRAPHQL;

  $data = call_mesh_api( $query );

  $products = array_map( function( $edge ) {
    $node = $edge['node'];
    return array(
      'id' => $node['id'],
      'name' => $node['title'],
      'description' => $node['descriptionHtml'],
      'price' => $node['priceRange']['minVariantPrice']['amount'],
      'image' => $node['images']['edges'][0]['node']['originalSrc'],
    );
  }, $data['data']['ShopifyStorefront_collection']['products']['edges'] );

  return array( 'products' => $products );
}


register_block_type( 'vip-commerce/vip-commerce-collection-block', array(
  'render_callback' => 'VIP\Commerce\vip_commerce_collection_render_block',
) );

function vip_commerce_collection_render_block( $attributes, $content) {
  $products = vip_commerce_get_products();
  
  $output = '<div class="vip-commerce-products">';
  
  foreach ( $products['products'] as $product ) {
    $output .= '<div class="vip-commerce-product">';
    $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 30%;" />';
    $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
    $output .= '<p>' . $product['description'] . '</p>';
    $output .= '<p>$' . number_format( $product['price'], 2 ) . '</p>';
    
    $output .= '</div>';
  }
  
  $output .= '</div>';

  $output .= $content;

  return $output;
}