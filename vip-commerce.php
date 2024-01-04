<?php
/**
 * Plugin Name: VIP Commerce
 */

function vip_commerce_check_settings() {
  $access_token = get_option('vip_commerce_shopify_access_token');
  $domain = get_option('vip_commerce_shopify_domain');

  $mesh_api_key = get_option('vip_commerce_mesh_api_key');
  $mesh_project_id = get_option('vip_commerce_mesh_project_id');

  if (!$mesh_api_key || !$mesh_project_id) {
    add_action('admin_notices', 'vip_commerce_settings_notice');
    return;
  }

  define( 'SHOPIFY_DOMAIN', $domain );
  define( 'SHOPIFY_ACCESS_TOKEN', $access_token );
  define( 'MESH_API_KEY', $mesh_api_key );
  define( 'MESH_PROJECT_ID', $mesh_project_id );

  require_once( plugin_dir_path( __FILE__ ) . 'blocks/commerce-block.php' );
  require_once( plugin_dir_path( __FILE__ ) . 'blocks/commerce-search-block.php' );
  //require_once( plugin_dir_path( __FILE__ ) . 'patterns/commerce-pattern.php' );
  add_action( 'enqueue_block_editor_assets', 'vip_commerce_enqueue' );

}
add_action('init', 'vip_commerce_check_settings');

function vip_commerce_settings_notice() {
  $settings_url = admin_url('options-general.php?page=vip-commerce-options-url');
  ?>
  <div class="notice notice-warning is-dismissible">
    <p>Please enter your <a href="<?php echo esc_url($settings_url); ?>">VIP Commerce settings</a>.</p>
  </div>
  <?php
}

function vip_commerce_enqueue() {
  wp_enqueue_script(
    'vip-commerce-block',
    plugins_url( 'build/index.js', __FILE__ ),
    array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-data', 'wp-api-fetch' ),
    filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ),
    true
  );
}

function call_mesh_api( $query) {

  $response = wp_remote_post( 'https://mesh-api.wpvip.com/project/' . MESH_PROJECT_ID . '/production/graphql', [
    'headers' => [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . MESH_API_KEY,
    ],
    'body' => json_encode(array('query' => $query)),
  ] );

  if ( is_wp_error( $response ) ) {
    return array( 'error' => $response->get_error_message() );
  }

  $body = wp_remote_retrieve_body( $response );
  $data = json_decode( $body, true );
  
  return $data;
}

function call_shopify_api( $query ) {
  $shopify_domain = SHOPIFY_DOMAIN;
  $access_token = SHOPIFY_ACCESS_TOKEN;

  $response = wp_remote_post( 'https://' . $shopify_domain . '/api/2020-10/graphql.json', [
    'headers' => [
      'Content-Type' => 'application/graphql',
      'X-Shopify-Storefront-Access-Token' => $access_token,
    ],
    'body' => $query,
  ] );

  if ( is_wp_error( $response ) ) {
    return array( 'error' => $response->get_error_message() );
  }

  $body = wp_remote_retrieve_body( $response );
  $data = json_decode( $body, true );
  
  return $data;
}


// ====================
// Settings section
// ====================
function vip_commerce_settings_page() {
  add_options_page('VIP Commerce options', 'VIP Commerce Options', 'manage_options', 'vip-commerce-options-url', 'vip_commerce_settings_page_html');
}
add_action('admin_menu', 'vip_commerce_settings_page');

function vip_commerce_register_settings() {
  register_setting('vip_commerce_settings', 'vip_commerce_shopify_access_token');
  register_setting('vip_commerce_settings', 'vip_commerce_shopify_domain');
  register_setting('vip_commerce_settings', 'vip_commerce_mesh_api_key');
  register_setting('vip_commerce_settings', 'vip_commerce_mesh_project_id');
}
add_action('admin_init', 'vip_commerce_register_settings');

function vip_commerce_settings_page_html() {
  ?>
  <div class="wrap">
    <h1>VIP Commerce Settings</h1>
    <form method="post" action="options.php">
      <?php
      settings_fields('vip_commerce_settings');
      //do_settings_sections('vip_commerce_settings');
      ?>
      <table class="form-table">
        <tr valign="top">
          <th scope="row">Shopify Access Token</th>
          <td>
            <input type="text" name="vip_commerce_shopify_access_token" value="<?php echo esc_attr(get_option('vip_commerce_shopify_access_token')); ?>" />
          </td>
        </tr>
        <tr valign="top">
          <th scope="row">Shopify Domain</th>
          <td>
            <input type="text" name="vip_commerce_shopify_domain" value="<?php echo esc_attr(get_option('vip_commerce_shopify_domain')); ?>" />
          </td>
        </tr>
        <tr valign="top">
          <th scope="row">Mesh API Key</th>
          <td>
            <input type="text" name="vip_commerce_mesh_api_key" value="<?php echo esc_attr(get_option('vip_commerce_mesh_api_key')); ?>" />
          </td>
        </tr>
        <tr valign="top">
          <th scope="row">Mesh Project ID</th>
          <td>
            <input type="text" name="vip_commerce_mesh_project_id" value="<?php echo esc_attr(get_option('vip_commerce_mesh_project_id')); ?>" />
          </td>
        </tr>
      </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <?php
}