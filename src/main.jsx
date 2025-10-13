import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // butang ni if mag create ug router 
import './styles.css'
import Startt from './pages/Startt'
import YouthLogin from './pages/YouthLogin'
import YouthSignup from './pages/YouthSignup'
import YouthVerificationResend from './pages/YouthVerificationResend'
import YouthHome from './pages/YouthHome'


//navigate between pages
const router = createBrowserRouter([
  {
  path: '/', 
  element: <Startt/>,
  errorElement: <div>404 Not Found</div>, //this part if mali imong gi type sa localhostname mao ni ang error na mogawas
},
{
  path: '/youthlogin', 
  element: <YouthLogin/>,
  errorElement: <div>404 Not Found</div>, //this part if mali imong gi type sa localhostname mao ni ang error na mogawas
},
{
  path: '/youthsignup', 
  element: <YouthSignup/>,
  errorElement: <div>404 Not Found</div>, //this part if mali imong gi type sa localhostname mao ni ang error na mogawas
},
{
  path: '/youthhomepage', 
  element: <YouthHome/>,
  errorElement: <div>404 Not Found</div>, //this part if mali imong gi type sa localhostname mao ni ang error na mogawas
},
{
  path: '/youthresendverification', 
  element: <YouthVerificationResend/>,
  errorElement: <div>404 Not Found</div>, //this part if mali imong gi type sa localhostname mao ni ang error na mogawas
},
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
