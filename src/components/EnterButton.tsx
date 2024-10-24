import './EnterButton.css';
import { useNavigate } from 'react-router-dom';

const EnterButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/tournaments');
  };

  return (
    <button onClick={handleClick} className="text-white bg-black border-4 border-purple-500 py-8 px-16 rounded-3xl text-8xl font-normal shadow-lg transition-transform hover:scale-110 glow-effect">
        Enter
    </button>
  );
};

export default EnterButton;
