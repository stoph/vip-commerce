const { registerBlockType } = wp.blocks;
const { apiFetch } = wp;
const { useState, useEffect } = wp.element;
const { TextControl, SelectControl, Button } = wp.components;

const { InnerBlocks } = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];

const { InspectorControls } = wp.blockEditor;
const { PanelBody } = wp.components;

registerBlockType( 'vip-commerce/vip-commerce-search-block', {
  title: 'VIP Commerce Search Block',
  icon: 'smiley',
  category: 'common',
  attributes: {
    searchPhrase: {
      type: 'string',
      default: ''
    },
    selectedProduct: {
      type: 'string',
      default: ''
    }
  },

  edit: ( props ) => {
    const { attributes: { searchPhrase, selectedProduct }, setAttributes } = props;
    const [ products, setProducts ] = useState( [] );

    useEffect( () => {
      if (searchPhrase) {
        apiFetch( { path: `/vip-commerce/v1/products-by-name?search=${searchPhrase}` } )
          .then( data => {
            setProducts( data.products );
          } );
      }
    }, [ searchPhrase ] );

    const handleOnChange = ( value ) => {
      setAttributes( { searchPhrase: value } );
    };

    const handleOnSelectProduct = ( productId ) => {
      setAttributes( { selectedProduct: productId } );
    };

    const handleOnSelectButtonClick = () => {
      if (products.length === 1) {
        handleOnSelectProduct(products[0].id);
      }
    };

    const selectedProductData = products.find( product => product.id === selectedProduct );

    let productData = selectedProductData;
    if (!productData) {
      productData = {
        name: 'Product Name',
        description: 'Product Description',
        price: '0.00',
        image: 'https://via.placeholder.com/360x360'
      };
    }

    return (
      <>
        <InspectorControls>
          <PanelBody title="Product Search">
            <TextControl
              label="Search Phrase"
              value={ searchPhrase }
              onChange={ handleOnChange }
            />
            <SelectControl
              label="Select a Product"
              value={ selectedProduct }
              options={ products.map( product => ( { label: product.name, value: product.id } ) ) }
              onChange={ handleOnSelectProduct }
            />
            <Button isPrimary onClick={ handleOnSelectButtonClick }>Select</Button>
          </PanelBody>
        </InspectorControls>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%' }}>
            { productData && (
              <div>
                <h2>{ productData.name }</h2>
                <div dangerouslySetInnerHTML={ { __html: productData.description } }></div>
                <p>${ parseFloat(productData.price).toFixed(2) }</p>
                <img src={ productData.image } alt={ productData.name } style={ { maxWidth: '30%' } } />
              </div>
            ) }
          </div>
          <div style={{ width: '50%' }}>
            <InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
          </div>
        </div>
      </>
    );
  },

  save: ( props ) => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <InnerBlocks.Content />
        </div>
      </div>
    );
  },
} );