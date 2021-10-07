import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { leaderboardSocket } from '../global/socket';
import userContext from '../global/userContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function EndBuyingPhase() {
  const classes = useStyles();
  const [artforTeams, setArtForTeams] = useState();
  const [gameWinner, setGameWinner] = useState({});
  const { player } = useContext(userContext);

  useEffect(() => {
    leaderboardSocket.on('displayGameWinner', ({ winner, leaderboard }) => {
      const { teamName } = player;
      const allTeamArt = leaderboard[teamName];
      setArtForTeams(allTeamArt);
      setGameWinner(winner);
    });
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ backgroundColor: '#ffd4db', padding: '20px', color: '#000000' }}>
        The winner is
        {' '}
        Team
        {' '}
        {gameWinner.team}
      </h2>
      <h3>Congratulations! For creating your favorite art collection!</h3>
      <div className={classes.root}>
        <ImageList rowHeight={300} className={classes.imageList}>
          {
            artforTeams
            && artforTeams.map((item) => {
              const { auctionObj } = item;
              return (
                <ImageListItem key={item.auctionId}>
                  <img key={item.auctionId} src={auctionObj.imageURL} alt={auctionObj.name} />
                </ImageListItem>
              );
            })
          }
        </ImageList>
      </div>
    </div>
  );
}

export default EndBuyingPhase;
