import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    display: 'flex',
    flexWrap: 'wrap',
    color: '#fff',
    backgroundColor: '#222024',
    margin: '2% auto'
  },
  media: {
    height: 140,
  },
});

const MediaCard = ({articleImg, articleSource, articleDesc, articleLink}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea href={articleLink} target='_blank'>
        <CardMedia
          className={classes.media}
          image={articleImg}
          title={articleDesc}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {articleSource}
          </Typography>
          <Typography variant="body2" color="#fff" component="p">
          {articleDesc}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button href={articleLink} target='_blank' size="small" color="primary">
          Read Article
        </Button>
      </CardActions>
    </Card>
  );
}

export default MediaCard;
