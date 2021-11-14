import React, {
  useContext, useEffect,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { socket } from '../global/socket';
import userContext from '../global/userContext';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    position: 'absolute',
    color: '#ffffff',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#76e246',
  },
  listcontainer: {
    textAlign: 'center',
    margin: '0 auto',
    width: '50%',
  },
  listitem: {
    marginTop: '20px',
  },
  startgamebutton: {
    marginTop: '80px',
    width: '90%',
    backgroundColor: '#76e246',
    color: '#000000',
    fontWeight: '700',
    fontSize: '24px',
  },
  p: {
    fontSize: '18px',
    fontWeight: '700',
    '& span': {
      color: '#76e246',
    },
  },
  listtext: {
    '& .MuiListItemText-primary': {
      fontSize: '20px',
      fontWeight: '700',
    },
  },
}));

function GameInstructions({ playersJoinedInfo }) {
  const classes = useStyles();
  const history = useHistory();

  const { player } = useContext(userContext);

  const startGame = () => {
    socket.emit('startGame', JSON.stringify(player));
    history.push(`/game/${player.playerId}`);
  };

  useEffect(() => {
    if (playersJoinedInfo) {
      const { numberOfPlayers, playersJoined } = playersJoinedInfo;
      if (numberOfPlayers === (playersJoined - 1)) {
        setTimeout(() => startGame(), 1);
      }
    }
  }, [playersJoinedInfo]);

  return (
    <div className={classes.container}>
      <p className={classes.title}>Art Quest</p>
      <p className={classes.p}>Your challenge, should you choose to accept it, is to create your favorite art collection.</p>
      <p className={classes.p}>
        How will you do it? By taking part in
        {' '}
        <span>AUCTIONS</span>
        {' '}
        and by putting
        {' '}
        <span>BIDS</span>
        {' '}
        on your favorite art pieces.
      </p>
      <List className={classes.listcontainer} dense>
        <ListItem className={classes.listitem}>
          <ListItemIcon>
            <StarIcon style={{ color: '#76e246' }} />
          </ListItemIcon>
          <ListItemText className={classes.listtext} primary="Create your FAVORITE art collection" />
        </ListItem>
        <ListItem className={classes.listitem}>
          <ListItemIcon>
            <StarIcon style={{ color: '#76e246' }} />
          </ListItemIcon>
          <ListItemText className={classes.listtext} primary="Spend your cash WISELY" />
        </ListItem>
        <ListItem className={classes.listitem}>
          <ListItemIcon>
            <StarIcon style={{ color: '#76e246' }} />
          </ListItemIcon>
          <ListItemText className={classes.listtext} primary="Collect most number of HIGH-QUALITY paintings" />
        </ListItem>
      </List>
      <p className={classes.p}>Let the bidding wars begin!</p>
      { playersJoinedInfo && (playersJoinedInfo.playersJoined - 1) !== playersJoinedInfo.numberOfPlayers
        ? (
          <div style={{ border: '5px solid #76e246' }}>
            <h3>
              Player
              {' '}
              {(playersJoinedInfo.playersJoined - 1)}
              {' '}
              of
              {' '}
              {playersJoinedInfo.numberOfPlayers}
              {' '}
              joined. Waiting for others to join...
            </h3>
          </div>
        ) : (
          <div style={{ border: '5px solid #76e246' }}>
            <h3>All players Joined. Starting game ...</h3>
          </div>
        )}
    </div>
  );
}

export default GameInstructions;
