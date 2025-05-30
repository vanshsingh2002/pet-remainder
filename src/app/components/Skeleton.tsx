const Skeleton = ({ className = "", style = {} }) => (
  <div
    className={
      "animate-pulse bg-gray-200 rounded-md " + className
    }
    style={style}
  />
);

export default Skeleton; 