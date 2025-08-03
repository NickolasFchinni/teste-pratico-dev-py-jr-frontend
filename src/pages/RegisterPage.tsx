import RegisterForm from "../components/RegisterForm";


const RegisterPage = () => {
  return (
    <div className="bg-[#10141E] h-screen">
      <div className="mx-auto container w-max flex items-center justify-center h-screen">
        <div className="bg-[#030712] flex items-center justify-center flex-col gap-5 p-5 rounded-xl">
          <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
          <RegisterForm />
          <p className="text-white">
            Já tem conta? <a href="/login" className="text-[#00BCFF]">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;