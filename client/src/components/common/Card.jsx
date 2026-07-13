function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8">
      {children}
    </div>
  );
}

export default Card;