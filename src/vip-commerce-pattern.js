const { registerBlockPattern } = wp.blocks;

registerBlockPattern('vip-commerce/vip-commerce-pattern', {
  title: 'My Pattern',
  content: '<!-- wp:vip-commerce/vip-commerce-search-block /-->',
});