import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface RegisterData {
  username: string;
  password: string;
  password2: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      setError('As senhas não coincidem');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await api.post('/register/', {
        username: formData.username,
        password: formData.password
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      const errorMsg = 'Erro ao criar conta ' + err;
      setError(errorMsg);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 text-white w-[20rem]'>
      {success ? (
        <div className="text-green-400 text-center">
          Conta criada com sucesso!
        </div>
      ) : (
        <>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Usuário"
            required
            className='bg-[#1D202A] border-1 px-5 py-2 border-[#364153] rounded-2xl text-white'
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Senha"
            required
            minLength={8}
            className='bg-[#1D202A] border-1 px-5 py-2 border-[#364153] text-white rounded-2xl'
          />
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            placeholder="Confirme a senha"
            required
            className='bg-[#1D202A] border-1 px-5 py-2 border-[#364153] text-white rounded-2xl'
          />
          {error && <p className="error text-center text-red-400">{error}</p>}
          <button 
            type="submit" 
            className='bg-[#364153] px-5 py-2 text-white rounded-2xl mt-3 font-semibold'
          >
            Registrar
          </button>
        </>
      )}
    </form>
  );
};

export default RegisterForm;