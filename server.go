package main

import (

	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	router := gin.Default()
	
	router.LoadHTMLFiles("./template/index.tmpl")	

	router.GET("/main", func(c *gin.Context) {
		c.HTML(http.StatusOK,"index.tmpl", nil)
		//c.HTML(http.StatusOK,"http.tmpl", nil)
	})

	router.StaticFS("/static", http.Dir("./static"))

	router.Run(":8080")
	//router.RunTLS(":8080", "/home/peter/ssl/leaf.pem", "/home/peter/ssl/leaf.key")
}
