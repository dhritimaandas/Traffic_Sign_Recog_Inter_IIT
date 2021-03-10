import React from 'react'
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        IIT (BHU)
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}