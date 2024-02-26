<?php
namespace VIP\Commerce;

function myRemoteDataShortcode($atts) {
  $attributes = shortcode_atts([
    'gid' => '',
    'field' => '',
    'format' => 'raw',
    'decimals' => 2,
    //'locale' => 'en',
    //'currency' => 'USD',
  ], $atts);

  $product = vip_commerce_get_product_by_id( $attributes['gid'] );

  if ( ! $product ) {
    return '<i>Product not found</i>';
  }

  if ( ! $product[$attributes['field']] ) {
    return '<i>Field not found</i>';
  }

  switch ($attributes['format']) {
    case 'raw':
      return $product[$attributes['field']];
    case 'number':
      $decimals = $attributes['decimals']; // TODO: validate
      return number_format($product[$attributes['field']], $decimals, '.', ',');
    case 'currency':
      // Needs php intl extension
      //$fmt = numfmt_create($attributes['locale'], \NumberFormatter::CURRENCY);
      //return numfmt_format_currency($fmt, $product[$attributes['field']], $attributes['currency']);
  }
  
  return $product[$attributes['field']];
}

add_shortcode('shopify', 'VIP\Commerce\myRemoteDataShortcode');