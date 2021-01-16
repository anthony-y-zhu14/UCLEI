const returnStyles = function() {
  let styles = {
      main: {
        display: 'flex',
        flexWrap: 'wrap',
        position: 'absolute',
        width: '90%',
        height: '100%',
        justifyContent: 'space-around',
        margin: '2%',
        padding: 20,
        zIndex: 2
      },
      font: {
        fontSize: 18,
        margin: '.5em',
        fontWeight: 'bold',
      },
      popStockContainer: {
        display: 'wrap',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        overflowY: 'auto',
        width: '55%',
        height: '40%',
        borderRadius: '10px',
        background: '#393b41',
        color: '#fff',
        margin: '.5%',
        padding: '0.5em 1em 1.5em 1em'
      },
      watchListContainer: {
          display: 'wrap',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          width: '35%',
          height: '40%',
          overflowY: 'auto',
          borderRadius: '10px',
          background: '#393b41',
          color: '#fff',
          margin: '.5%',
        },
      newsContainer: {
        width: '35%',
        height: '62%',
        overflowY: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: '10px',
        position: 'relative',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        background: '#393b41',
        color: '#fff',
        margin: '.5%'
      },
      chartContainer: {
        // display: 'wrap',
        overflowY: 'auto',
        paddingTop: 20,
        wrap: 'wrap',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: '55%',
        height: '62%',
        borderRadius: '10px',
        position: 'relative',
        background: '#393b41',
        color: '#fff',
        margin: '.5%'
      },
      oCard: {
        margin: '10%'
      },
      breaker: {
        paddingTop: '3em',
        paddingBottom: '1em'
      },
      ticker: {
        display: 'inline-block',
       '&:hover':{
          color: '#6C9FF8',
          cursor: 'pointer'
        },
      },
      smallFont: {
        fontSize: '14px',
        marginRight: '1rem',
        marginLeft: '1rem'
      },
      controller: {
        float: 'right',
        marginRight: '1rem'
      },
      fourohone: {
        marginLeft: '20rem',
        color: '#000'
      },
      li: {
        marginLeft: '20rem',
        textDecoration: 'underline',
        color: '#000',
        '&:hover':{
          color: '#6C9FF8',
          cursor: 'pointer'
        },
      }
    };

  return styles;
}

export default returnStyles;
