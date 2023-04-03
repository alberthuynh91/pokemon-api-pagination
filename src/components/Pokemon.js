const Pokemon = (props) => {
  const { name } = props;
  return <div className="pokemon-wrapper">{name}</div>;
};

export default Pokemon;
