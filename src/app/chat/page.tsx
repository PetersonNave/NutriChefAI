'use client'
import React from "react";
import '@/styles/globals.css';

// components imports
import RecipeGenerate from "../../components/RecipeGenerate";
import Layout from "@/layouts/layout";


const Receitas = () =>{
 
    return (
        <Layout>
          <RecipeGenerate/>
        </Layout>
    )
}

export default Receitas