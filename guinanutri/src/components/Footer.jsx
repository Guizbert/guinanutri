import { Footer } from "flowbite-react";
import Logo from '../images/logo.png';
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsX} from 'react-icons/bs';

export default function FooterC(){

    return (
        <Footer container className="border border-t-8 dark:border-blue-200 border-yellow-200">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="">
                        <Link to='/' className="self-center">
                            <img src={Logo} alt="guina nutri logo" 
                            className='h-1/1 w-1/3  bg-opacity-0' />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm: mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="About"/>
                            <Footer.LinkGroup col>
                                <Footer.Link
                                href="/about">
                                    Qui somme-nous
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Réseaux sociaux"/>
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    // href="https://twitter.com/"
                                    // target="_blank" //redirect dans new page
                                    rel='noopener noreferrer'
                                    //https://www.lafactory.com/blog/que-signifie-la-balise-relnoopener-noreferrer-et-affecte-t-elle-le-referencement/
                                >
                                    Aucun
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal"/>
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="#"
                                >
                                    Rien
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider/> 
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                        <Footer.Copyright href="#" by="Ravier Albérich :-)" 
                        year={new Date().getFullYear()}/>
                    
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook}/>
                        <Footer.Icon href="#" icon={BsInstagram}/>
                        <Footer.Icon href="#" icon={BsX}/>

                    </div>
                </div>
            </div>
        </Footer>
    )
}