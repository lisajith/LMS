function Card({ children }) {
  return (
    <div className="card-theme rounded-2xl p-8 shadow-md
                    transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:shadow-xl">
      {children}
    </div>
  );
}

export default Card;