<?php 
namespace VIP\Commerce;

// Search by name
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

  return array( 'products' => $products );
}

// Search by tags
add_action( 'rest_api_init', function () {
  register_rest_route( 'vip-commerce/v1', '/products-by-tag', array(
    'methods' => 'GET',
    'callback' => function ( \WP_REST_Request $request ) {
      $tags = $request->get_param( 'tags' );
      return vip_commerce_get_products_by_tag( $tags );
    },
    'permission_callback' => '__return_true',
  ) );
} );

function vip_commerce_get_products_by_tag( $tag_ids ) {
  $tag_ids_array = explode(',', $tag_ids);
  $tags_query_parts = [];

  foreach ($tag_ids_array as $tag_id) {
      $tag = get_term_by('id', (int)$tag_id, 'post_tag');
      if ($tag) {
          $tags_query_parts[] = "(tag:" . $tag->name . ")";
      }
  }

  $tags_query = implode(' OR ', $tags_query_parts);
  // ShopifyStorefront_products(first: 10, query: "tag:jamaica OR tag:valentine's day") {

  $query = <<<GRAPHQL
    {
      ShopifyStorefront_products(first: 10, query: "$tags_query") {
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
//           maxVariantPrice {
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

  $product = $data['data']['ShopifyStorefront_product'];

  $slug = createSlug($product['title']);
  return array(
    'id' => $product['id'],
    'name' => $product['title'],
    'slug' => $slug,
    'description' => $product['descriptionHtml'],
    'price' => $product['priceRange']['maxVariantPrice']['amount'],
    'image' => $product['images']['edges'][0]['node']['originalSrc'],
  );
}

function createSlug($text) {
  $text = strtolower($text);
  $text = preg_replace('/[^a-z0-9-]/', '-', $text);
  $text = preg_replace('/-+/', "-", $text);
  return trim($text, '-');
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

  $pdp_url = get_product_detail_page_url();

  $output = '<div class="vip-commerce-product">';
  $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
  $output .= '<table><tbody>';
  $output .= '<tr><td style="width: 240px;">';
  $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 100%;" />';
  $output .= '</td><td>';
  $output .= '<p>' . $product['description'] . '</p>';
  $output .= '<p>$' . number_format( $product['price'], 2 ) . ' <button>Add to Cart</button></p>';
  //$output .= '<a href="https://stoph-test.myshopify.com/products/' . $product['slug'] . '"><button>View Product</button></a>';
  $output .= '<a href="' . $pdp_url . '?id=' . $product['id'] . '"><button>View Product</button></a>';
  
  $output .= '</td></tr>';
  $output .= '</tbody></table>';
  $output .= '</div>';

  $output .= $content;

  return $output;
}