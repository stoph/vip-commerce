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
            { selectedProductData && (
              <div>
                <h2>{ selectedProductData.name }</h2>
                <div dangerouslySetInnerHTML={ { __html: selectedProductData.description } }></div>
                <p>${ parseFloat(selectedProductData.price).toFixed(2) }</p>
                <img src={ selectedProductData.image } alt={ selectedProductData.name } style={ { maxWidth: '30%' } } />
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