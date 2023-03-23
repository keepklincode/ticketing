import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../app/build-client";
import Header from "../component/header";

// for this to work we must run npm install bootstrap
const AppComponent = ({ Component, pageProps, currentUser}) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <div className="container"> 
      <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps){
   pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
}
  console.log(pageProps);

  return {
    pageProps,
    ...data
  }
}

export default AppComponent; 