import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SideNav from "./SideNav.js"
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  }
}));


export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });  
  };


  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      <SideNav />
    </div>
  );




  const content = (

    <div>    
      <React.Fragment key={'left'}>
        <IconButton onClick={toggleDrawer('left', true)}
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"  >
          <MenuIcon />
        </IconButton>
        
        <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
          {list('left')}
        </Drawer>
      </React.Fragment>   
    </div>


    

  
  // <React.Fragment key={'left'}>
  //   {toggleDrawer('left', true)}
  //   {console.log(state)}
  //     <Drawer              
  //           anchor={'left'}
  //           open={state.left}
  //           onClose={toggleDrawer('left', false)}
  //           classes={{
  //             paper: classes.drawerPaper,
  //           }}
  //     >
  //            {list('left')}

  //     </Drawer>
  //   </React.Fragment>

   



  )

  return (
    content
  );
}
