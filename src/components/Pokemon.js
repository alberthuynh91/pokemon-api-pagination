const Pokemon = (props) => {
  const { name, url } = props;
  return <div className="pokemon-wrapper">{name}</div>;
};

export default Pokemon;
