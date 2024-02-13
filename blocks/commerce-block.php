<?php 
namespace VIP\Commerce;

add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/products', array(
    'methods' => 'GET',
    'callback' => 'VIP\Commerce\vip_commerce_get_products',
    'permission_callback' => '__return_true',
  ) );
} );

function vip_commerce_get_products() {

  $query = <<<GRAPHQL
    {
      ShopifyStorefront_products(first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
            priceRange {
              maxVariantPrice {
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
GRAPHQL;

  
  $data = call_mesh_api( $query );
  
  $products = array_map( function( $edge ) {
    $node = $edge['node'];
    return array(
      'id' => $node['id'],
      'name' => $node['title'],
      'description' => $node['descriptionHtml'],
      'price' => $node['priceRange']['maxVariantPrice']['amount'],
      'image' => $node['images']['edges'][0]['node']['originalSrc'],
    );
  }, $data['data']['ShopifyStorefront_products']['edges'] );

  //error_log(print_r($products, true));
  return array( 'products' => $products );
}

register_block_type( 'vip-commerce/vip-commerce-block', array(
  'render_callback' => 'VIP\Commerce\vip_commerce_render_block',
) );

function vip_commerce_render_block( $attributes ) {
  $products = vip_commerce_get_products();
  
  $pdp_url = get_product_detail_page_url();

  $output = '<div class="vip-commerce-products">';
  
  foreach ( $products['products'] as $product ) {
    $output .= '<div class="vip-commerce-product">';
    $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
    $output .= '<p>' . $product['description'] . '</p>';
    $output .= '<p>$' . number_format( $product['price'], 2 ) . '</p>';
    $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 30%;" />';
    $output .= '<a href="' . $pdp_url . '?id=' . $product['id'] . '"><button>View Product</button></a>';
    $output .= '</div>';
  }
  
  $output .= '</div>';

  return $output;
}