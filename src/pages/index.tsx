'use client'
import React from "react";
import '../Styles/globals.css';

// components imports
import Layout from "@/components/layout";
import RecipeGenerate from "@/components/RecipeGenerate";



const Receitas = () =>{
 
    return (
        <Layout>
          <RecipeGenerate/>
        </Layout>
    )
}

export default Receitas