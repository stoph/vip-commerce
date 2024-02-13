<?php 
namespace VIP\Commerce;

/**
 * Render function
 */

register_block_type( 'vip-commerce/vip-commerce-display-block', array(
  'render_callback' => 'VIP\Commerce\vip_commerce_display_render_block',
) );

function vip_commerce_display_render_block( $attributes, $content ) {
  $id = isset($_GET['id']) ? sanitize_text_field($_GET['id']) : '';

  if ( ! isset( $_GET['id'] ) ) {
    return '<div class="vip-commerce-product">No product selected</div>';
  } else {
    $selected_product_id = $id;
  }

  // Fetch the product data from Shopify
  $product = vip_commerce_get_product_by_id( $selected_product_id );

  if ( ! $product ) {
    return '<div class="vip-commerce-product">Product not found [' . $selected_product_id . ']</div>';
  }

  $pdp_url = get_product_detail_page_url();

  $output = '<div class="vip-commerce-product">';
  $output .= '<h2>' . esc_html( $product['name'] ) . '</h2>';
  $output .= '<p>$' . number_format( $product['price'], 2 ) . '</p>';
  $output .= '<table><tbody>';
  $output .= '<tr><td style="width: 240px;">';
  $output .= '<img src="' . esc_url( $product['image'] ) . '" alt="' . esc_attr( $product['name'] ) . '" style="max-width: 100%;" />';
  $output .= '</td><td>';
  $output .= '<p>' . $product['description'] . '</p>';

  $output .= '</td></tr>';
  $output .= '</tbody></table>';
  $output .= '</div>';

  $output .= $content;

  return $output;
}