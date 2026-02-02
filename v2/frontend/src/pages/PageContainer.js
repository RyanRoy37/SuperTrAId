// frontend/src/pages/PageContainer.js


export function withPageContainer(Component, title) {
  return function Wrapped(props) {
    return (
      <div className="page-container">
        <h2 className="page-title">{title}</h2>
        <Component {...props} />
      </div>
    );
  };
}
