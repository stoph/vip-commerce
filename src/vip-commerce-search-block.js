
const { apiFetch } = wp;
const { useSelect } = wp.data;
const { registerBlockType } = wp.blocks;
const { useState, useEffect } = wp.element;
const { TextControl, SelectControl, Button, PanelBody } = wp.components;
const { InnerBlocks, InspectorControls } = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];

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
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    const postTags = useSelect(select => select('core/editor').getEditedPostAttribute('tags'), []);

    // Effect for recommended products based on postTags
    useEffect(() => {  
      if (postTags && postTags.length > 0) {
        apiFetch({ path: `/vip-commerce/v1/products-by-tag?tags=${postTags.join(',')}` })
          .then(data => {
            setRecommendedProducts(data.products);
          });
      }
    }, [postTags]);

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

    //const selectedProductData = products.find( product => product.id === selectedProduct );
    const selectedProductData = products.find(product => product.id === selectedProduct) || recommendedProducts.find(product => product.id === selectedProduct);

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
              //options={ products.map( product => ( { label: product.name, value: product.id } ) ) }
              options={[
                { label: "Choose one...", value: '' },
                ...products.map(product => ({ label: product.name, value: product.id }))
              ]}
              onChange={ handleOnSelectProduct }
            />
            <Button isPrimary onClick={ handleOnSelectButtonClick }>Select</Button>
          </PanelBody>
          <PanelBody title="Recommended Products">
            <SelectControl
              label="Select a Recommended Product"
              value={selectedProduct}
              //options={recommendedProducts.map(product => ({ label: product.name, value: product.id }))}
              options={[
                { label: "Choose one...", value: '' },
                ...recommendedProducts.map(product => ({ label: product.name, value: product.id }))
              ]}
              onChange={handleOnSelectProduct}
            />
          </PanelBody>
        </InspectorControls>
        { productData && (
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
                        <Button isPrimary>View Product</Button>
                      </a>
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
        ) }
        <InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
      </>
    );
  },

  save: ( props ) => {
    return ( <InnerBlocks.Content /> );
  },
} );