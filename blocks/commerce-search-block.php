<?php 
namespace VIP\Commerce;

add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/products-by-name', array(
    'methods' => 'GET',
    'callback' => function ( \WP_REST_Request $request ) {
      $search_term = $request->get_param( 'search' );
      return vip_commerce_get_products_by_name( $search_term );
    },
    'permission_callback' => '__return_true',
  ) );
} );

function vip_commerce_get_products_by_name( $search_term ) {

  $query = <<<GRAPHQL
    {
      ShopifyStorefront_products(first: 10, query: "title:'$search_term'") {
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
  GRAPHQL;
// error_log($query);
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
  }, $data['data']['ShopifyStorefront_products']['edges'] );

  return array( 'products' => $products );
}

function vip_commerce_get_product_by_id( $product_id ) {

  $query = <<<GRAPHQL
  {
    ShopifyStorefront_product(id:"$product_id") {
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
GRAPHQL;
// products query expect just the numeric portion of the id, as opposed to the full gid product above expects. grrr
// $query = <<<GRAPHQL
// {
//   ShopifyStorefront_products(first: 10, query: "id:'$product_id'") {
//     edges {
//       node {
//         id
//         title
//         descriptionHtml
//         priceRange {
//           minVariantPrice {
//             amount
//           }
//         }
//         images(first: 1) {
//           edges {
//             node {
//               originalSrc
//             }
//           }
//         }
//       }
//     }
//   }
// }
// GRAPHQL;
  $data = call_mesh_api( $query );
  //error_log($query);
  //error_log(print_r($data, true));

  $product = $data['data']['ShopifyStorefront_product'];

  return array(
    'id' => $product['id'],
    'name' => $product['title'],
    'description' => $product['descriptionHtml'],
    'price' => $product['priceRange']['minVariantPrice']['amount'],
    'image' => $product['images']['edges'][0]['node']['originalSrc'],
  );
}

/**
 * Render function
 */

register_block_type( 'vip-commerce/vip-commerce-search-block', array(
  'render_callback' => 'VIP\Commerce\vip_commerce_search_render_block',
) );

function vip_commerce_search_render_block( $attributes, $content ) {

  if ( ! isset( $attributes['selectedProduct'] ) ) {
    return '<div class="vip-commerce-product">No product selected</div>';
  }

  $selected_product_id = $attributes['selectedProduct'];

  // Fetch the product data from Shopify
  $product = vip_commerce_get_product_by_id( $selected_product_id );

  if ( ! $product ) {
    return '<div class="vip-commerce-product">Product not found [' . $selected_product_id . ']</div>';
  }

  $output = '<div class="vip-commerce-product">';
  $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
  $output .= '<p>' . $product['description'] . '</p>';
  $output .= '<p>$' . number_format( $product['price'], 2 ) . '</p>';
  $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 30%;" />';
  $output .= '</div>';

  $output .= $content;

  return $output;
}