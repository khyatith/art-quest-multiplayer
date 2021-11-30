import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useSessionStorage from '../hooks/useSessionStorage';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    color: '#76e246',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  playerdiv: {
    fontWeight: 700,
    color: '#76e246', // green color
  },
  appbar: {
    background: '#051207', // black color
  },
}));

function Header() {
  const classes = useStyles();
  const player = useSessionStorage('user')[0];
  return (
    <div className={classes.grow}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            ART QUEST
          </Typography>
          { player
            && (
            <div className={classes.playerdiv}>
              <p>
                {player.playerName}
                , Team&nbsp;
                {player.teamName}
                ,
                {' '}
                {player.playerId}
              </p>
            </div>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default Header;
