import React, { useEffect, useState } from "react";
import type { INArticle, INCreateArticle } from "../utils/nest/article";
import { articleService } from "../services/nest/article.service";
import type INCategory from "../utils/nest/category";
import { categoryService } from "../services/nest/category.service";

export default function Article() {
    const [articles, setArticles] = useState<INArticle[]>([]);
    const [categories, setCateogories] = useState<INCategory[]>([]);

    const [articleForm, setArticleForm] = useState<INCreateArticle>()
    useEffect(() => {
        const articlesResponse = articleService.getAll();
        const categoriesResp = categoryService.getAll();
        articlesResponse.then(value => {
            setArticles(value);
            console.log(value);
        })
        categoriesResp.then(value => {
            setCateogories(value);
        })
    }, []);


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        const form = { ...articleForm!, [name]: value };
        setArticleForm(form);
        console.log("dddd");
    }
  async  function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
        console.log(articleForm);
        if (articleForm){
            articleForm.idCategory = Number (articleForm.idCategory);
            await articleService.create (articleForm);
        }
    }
    return (
        <div>
            <div>
                <form action="" method="post" onSubmit={handleSubmit}   >
                    <p>Name: <input type="text" name="name" onChange={handleInputChange} /></p>
                    <p>Description: <input type="text" name="description" onChange={handleInputChange} /> </p>
                    <p>Categories:

                        <select name="idCategory" onChange={handleInputChange}>
                            {
                                categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))
                            }
                        </select>
                    </p>

                    <input type="submit" name="" id="" value={"valider"} />

                </form>
            </div>
            <hr />
            <div>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nom</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            articles.map(a => (
                                <tr key={a.id}>
                                    <td>{a.id}</td>
                                    <td>{a.name}</td>
                                    <td>{a.description}</td>
                                </tr>
                            ))
                        }
                    </tbody>


                </table>
            </div>

        </div>
    );
}