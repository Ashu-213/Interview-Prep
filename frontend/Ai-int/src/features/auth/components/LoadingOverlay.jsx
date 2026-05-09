import './loadingOverlay.scss';

const LoadingOverlay = ({ message = "Processing...", submessage = "" }) => {
  return (
    <main className="loading-screen">
      <div className="loader-content">
        <div className="spinner" />
        <h2>{message}</h2>
        {submessage && <p>{submessage}</p>}
      </div>
    </main>
  );
};

export default LoadingOverlay;
