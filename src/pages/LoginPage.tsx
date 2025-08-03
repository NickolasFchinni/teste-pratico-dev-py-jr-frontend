import LoginForm from "../components/LoginForm"

const LoginPage = () => {
  return (
    <div className="bg-[#10141E] h-screen">
      <div className="mx-auto container w-max flex items-center justify-center h-screen">
        <div className="bg-[#030712] flex items-center justify-center flex-col gap-5  p-5 rounded-xl">
          <h1 className="text-2xl font-bold text-white">Login</h1>
          <LoginForm />
          <p className="text-white">
            Não tem conta? <a href="/register" className="text-[#00BCFF]">Registre-se</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
