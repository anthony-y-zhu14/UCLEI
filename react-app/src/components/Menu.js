import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import SideNav from "./SideNav.js"

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: true,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift' || event.type === 'onclick')) {
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


    // {['left', 'right', 'top', 'bottom'].map((anchor) => (
    //   <React.Fragment key={anchor}>
    //     <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
    //     <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
    //       {list(anchor)}
    //     </Drawer>
    //   </React.Fragment>
    // ))}

    <React.Fragment key={'left'}>
      <Drawer
            variant="temporary"
            anchor={'left'}
            open={state.left}
            onClose={toggleDrawer('left', false)}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
             {list('left')}

        </Drawer>

    </React.Fragment>



  )

  return (
    content
  );
}
