import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import Register from './pages/Register';
import UserBlogs from './pages/UserBlogs';
import CreateBlog from './pages/CreateBlog';
import BlogDetails from './pages/BlogDetails';
import { Toaster } from "react-hot-toast";
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/my-blogs" element={<UserBlogs />} />
        <Route path='/blog-details/:id' element={<BlogDetails />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
