
const { apiFetch } = wp;
const { useSelect } = wp.data;
const { registerBlockType } = wp.blocks;
const { useState, useEffect } = wp.element;
const { TextControl, SelectControl, Button, PanelBody } = wp.components;
const { InnerBlocks, InspectorControls } = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];

registerBlockType( 'vip-commerce/vip-commerce-display-block', {
  title: 'VIP Commerce Display Block',
  icon: 'smiley',
  category: 'common',
  
  edit: ( props ) => {
    
  let productData = {
    name: 'Product Name',
    description: 'Product Description',
    price: '0.00',
    image: 'https://via.placeholder.com/360x360'
  };
    
    return (
      <>
          <div>
            <h2>{ productData.name }</h2>
            <p>${ parseFloat(productData.price).toFixed(2) }</p>
            <table>
              <tbody>
                <tr>
                  <td style={{width: '240px'}}>
                    <img src={ productData.image } alt={ productData.name } />
                  </td>
                  <td>
                    <p dangerouslySetInnerHTML={ { __html: productData.description } }></p>
                      <a href='https://stoph-test.myshopify.com/products/'>
                        <button>View Product</button>
                      </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        <InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
      </>
    );
  },

  save: ( props ) => {
    return ( <InnerBlocks.Content /> );
  },
} );