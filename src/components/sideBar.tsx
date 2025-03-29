import '../styles/sideBar.css';
import Link from "next/link"

export default function SideBar(){

    return(
        <div className = "side-bar-background">

            <Link className = "side-bar-title" href="/" >NutriChef AI</Link>

            <div className= 'bottom-side-bar'>
                <Link href="/nutricion" className='button-side-bar'>nutricao</Link>
                <Link href="/share" className='button-side-bar'>share</Link>
            </div>

        </div>
    )
}