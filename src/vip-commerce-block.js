const { registerBlockType } = wp.blocks;
const { apiFetch } = wp;
const { useState, useEffect } = wp.element;
const { Button } = wp.components;


registerBlockType( 'vip-commerce/vip-commerce-block', {
  title: 'VIP Commerce Block',
  icon: 'smiley',
  category: 'common',

  edit: ( props ) => {
    const [ products, setProducts ] = useState( [] );

    useEffect( () => {
      apiFetch( { path: '/vip-commerce/v1/products' } )
        .then( data => {
          setProducts( data.products );
        } );
    }, [] );

    return (
      <div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gridGap: '1em' } }>
        {products.map( ( product ) => (
          <div key={ product.id } style={ { border: '1px solid #ccc', padding: '1em' } }>
            <h2>{ product.name }</h2>
            <div dangerouslySetInnerHTML={ { __html: product.description } }></div>
            <p>${ parseFloat(product.price).toFixed(2) }</p>
            <img src={ product.image } alt={ product.name } style={ { maxWidth: '30%' } } />
            <Button isPrimary>View Product</Button>
          </div>
        ) )}
      </div>
    );
  },

  save() {
    return null;
  },
} );