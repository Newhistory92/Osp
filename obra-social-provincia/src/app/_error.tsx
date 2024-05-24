import { NextPageContext } from 'next';
import GlobalNotFound from './not-found';


interface ErrorProps {
    statusCode: number;
  }
  
  const Error = ({ statusCode }: ErrorProps) => {
    if (statusCode === 404) {
      return <GlobalNotFound />;
    }
  
    return (
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    );
  };
  
  Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
  };
  
  export default Error;