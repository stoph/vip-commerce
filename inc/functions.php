<?php

function get_product_detail_page_url() {
  
  // Set up the arguments for WP_Query
  $args = array(
      'post_type'      => 'page', // Fetch pages
      'posts_per_page' => 1,      // Limit to one result
      'post_status'    => 'publish', // Only published pages
      'title'          => 'Product Detail', // Title to search for
  );

  // Execute the query
  $query = new WP_Query($args);

  // Check if the query found any matching page
  if ($query->have_posts()) {
      $query->the_post(); // Set up post data
      $url = get_permalink(); // Get the permalink of the first matching page
      wp_reset_postdata(); // Reset post data
      return $url;
  }

  return ''; // Return empty string if no page found
}