/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Typography, TextField } from '@material-ui/core';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Confetti from 'react-confetti';
// import useWindowSize from '../../hooks/use-window-size';
import userContext from '../../global/userContext';
import { socket } from '../../global/socket';
import LeaderBoard from '../LeaderBoard';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    width: 500,
    padding: 20,
    // margin: '0 30%',
  },
  media: {
    height: '350px', // 16:9
  },
  titlestyle: {
    textAlign: 'center',
    color: '#212F3C',
    '& .MuiCardHeader-subheader': {
      color: '#212F3C',
      lineHeight: '1.9',
      fontSize: '18px',
    },
  },
  cardcontentstyle: {
    textAlign: 'center',
  },
  cardactionsstyle: {
    textAlign: 'center',
    display: 'block',
    padding: '0px',
  },
  textfieldstyle: {
    marginRight: '10px',
  },
  bottomcontainer: {
    display: 'flex',
    height: '100px',
    position: 'static',
    bottom: '0',
    borderTop: '1px solid #cccccc',
    margin: '20px 0px 0px 0px !important',
    backgroundColor: '#1C2833',
  },
  timercontainer: {
    textAlign: 'left',
  },
  lastbidcontainer: {
    textAlign: 'center',
    flex: '1',
    marginRight: '20px',
    backgroundColor: '#0fc',
    width: '50px',
    marginLeft: '80px',
    padding: '0 10px 10px 0',
  },
  lastbidby: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '700',
  },
  lastbidamount: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '700',
  },
  timercaption: {
    marginLeft: '10px',
    color: '#ffffff',
    lineHeight: '1.2px',
  },
  timer: {
    backgroundColor: '#333',
    color: '#0fc',
    fontSize: '40px',
    width: '50px',
    marginLeft: '10px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px 10px 0px 10px',
  },
  nextbtn: {
    backgroundColor: '#0fc',
    color: '#000',
    fontWeight: 700,
    '& .Mui-disabled': {
      backgroundColor: '#cccccc',
      color: '#616A6B',
    },
  },
  leaderboardroot: {
    float: 'right',
    margin: '0px',
    backgroundColor: '#1C2833',
    color: '#0fc',
    position: 'fixed',
    right: 0,
    width: '300px',
  },
  leaderboardheaderstyle: {
    '& .MuiCardHeader-title': {
      fontWeight: 700,
      fontSize: '20px',
    },
  },
  avatar: {
    height: '80px',
    width: '80px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    color: '#ffffff',
    top: '20px',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  listroot: {
    width: '100%',
    maxWidth: '36ch',
    // backgroundColor: theme.palette.background.paper,
  },
  teamdetails: {
    color: '#ffffff',
  },
}));

function EnglishAuction({ newAuctionObj, renderNextAuction }) {
  const classes = useStyles();
  // const windowSize = useWindowSize();
  const [live, setLive] = useState(false);
  const { player } = useContext(userContext);
  const [auctionObj, setAuctionObj] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [auctionTimer, setAuctionTimer] = useState();
  const [isDisableNextBtn, setDisableNextBtn] = useState(true);
  const [previousBidDetails, setPreviousBidDetails] = useState({
    bidAmount: 0,
    bidTeam: null,
  });

  useEffect(() => {
    setTimeout(() => {
      console.log('inside start auctions timer');
      socket.emit('startAuctionsTimer');
    }, 10000);
  }, [auctionObj]);

  useEffect(() => {
    if (newAuctionObj) {
      setDisableNextBtn(true);
      setAuctionObj(newAuctionObj);
    }
  }, [newAuctionObj]);

  useEffect(() => {
    socket.on('setPreviousBid', (previousBid) => {
      console.log('inside set previous bid', previousBid);
      if (previousBid && previousBid.bid) {
        setPreviousBidDetails(previousBid.bid);
      }
      // console.log(previousBid);
    });
  });

  useEffect(() => {
    socket.on('auctionTimerValue', (timerValue) => {
      console.log('timerValue', timerValue);
      setAuctionTimer(timerValue);
      setLive(true);
      if (timerValue.total <= 1000) {
        setDisableNextBtn(false);
      }
    });
  }, []);

  useEffect(() => {
    socket.on('auctionPageTimerEnded', () => {
      console.log('inside auction page timer ended');
      setDisableNextBtn(false);
      setLive(false);
    });
  });

  const setBidAmt = () => {
    const { bidAmount } = previousBidDetails;
    if (currentBid <= parseInt(bidAmount, 10)) {
      // show error
    } else {
      const bidInfo = {
        auctionType: auctionObj.auctionType,
        auctionObj,
        player,
        bidAmount: currentBid,
        bidAt: +new Date(),
        bidTeam: player.teamName,
      };
      socket.emit('addNewBid', bidInfo);
    }
  };

  const setCurrentBidAmt = (e) => {
    setCurrentBid(e.target.value);
  };

  const getNextAuction = () => {
    renderNextAuction();
    setPreviousBidDetails({
      bidTeam: null,
      bidAmount: 0,
    });
  };

  // const renderConfetti = () => {
  //   if (player.teamName === bidWinner.biddingteam && !isDisableNextBtn) {
  //     return <Confetti width={windowSize.width} height={windowSize.height} />;
  //   }
  //   return <></>;
  // };

  // const renderWinner = () => (
  //   <>
  //     <Collapse in={expanded} timeout="auto" unmountOnExit>
  //       <CardContent>
  //         {/* {bidWinner && bidWinner.bid && (
  //           <>
  //             {renderConfetti()}
  //             <List className={classes.listroot}>
  //               <ListItem alignItems="flex-start">
  //                 <ListItemAvatar>
  //                   <Avatar alt="artifact-img" src={bidWinner.imageURL} />
  //                 </ListItemAvatar>
  //                 <ListItemText
  //                   primary={bidWinner.name}
  //                   secondary={
  //                     // eslint-disable-next-line react/jsx-wrap-multilines
  //                     <>
  //                       <Typography component="p" variant="body2" className={classes.teamdetails} color="#ffffff">
  //                         Won by: Team {bidWinner.bid.bidTeam}
  //                       </Typography>
  //                       <Typography component="p" variant="body2" className={classes.teamdetails} color="#ffffff">
  //                         Paid: {bidWinner.bid.bidAmount}
  //                       </Typography>
  //                     </>
  //                   }
  //                 />
  //               </ListItem>
  //               <Divider variant="inset" component="li" />
  //             </List>
  //           </>
  //         )} */}
  //       </CardContent>
  //     </Collapse>
  //   </>
  // );

  return (
    <div className={classes.root}>
      <Button onClick={getNextAuction} size="large" className={classes.nextbtn} fullWidth disabled={isDisableNextBtn}>
        Click for next auction
      </Button>
      <LeaderBoard />
      {auctionObj && (
        <div className={classes.cardRoot}>
          <Card key={auctionObj.id}>
            <CardHeader className={classes.titlestyle} title={auctionObj.name} subheader={`Created By: ${auctionObj.artist}`} />
            <CardMedia className={classes.media} component="img" image={`${auctionObj.imageURL}`} title={auctionObj.name} />
            <CardContent className={classes.cardcontentstyle}>
              <Typography component="h6" variant="h6">
                {`Opening bid : $${auctionObj.originalValue}`}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardactionsstyle}>
              <div>
                <TextField
                  className={classes.textfieldstyle}
                  size="small"
                  disabled={!live}
                  type="number"
                  name="bidAmount"
                  placeholder="Bidding Amount"
                  variant="outlined"
                  onChange={setCurrentBidAmt}
                />
                <Button disabled={!live} variant="contained" color="secondary" onClick={setBidAmt}>
                  Bid
                </Button>
              </div>
              <div className={classes.bottomcontainer}>
                <div className={classes.timercontainer}>
                  <p className={classes.timercaption}>Time Remaining</p>
                  <div className={classes.timer}>{auctionTimer && auctionTimer.minutes}</div>
                  <div className={classes.timer}>{auctionTimer && auctionTimer.seconds}</div>
                </div>
                {previousBidDetails && previousBidDetails.bidTeam && previousBidDetails.bidAmount ? (
                  <div className={classes.lastbidcontainer}>
                    <p className={classes.lastbidby}>Last Bid By: {`Team ${previousBidDetails.bidTeam}`}</p>
                    <p className={classes.lastbidamount}>Last Bid Amount: {previousBidDetails.bidAmount}</p>
                  </div>
                ) : (
                  <div className={classes.lastbidcontainer}>
                    <p className={classes.lastbidby}>Highest bid will show here</p>
                  </div>
                )}
              </div>
            </CardActions>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EnglishAuction;
