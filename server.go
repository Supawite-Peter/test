package main

import (

	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"log"
)

func main() {
	
	port := os.Getenv("PORT")
	
	if port == "" {
		log.Fatal("$PORT must be set")
	}
	
	router := gin.Default()
	
	router.LoadHTMLFiles("./template/index.tmpl")	

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK,"index.tmpl", nil)
		//c.HTML(http.StatusOK,"http.tmpl", nil)
	})

	router.StaticFS("/static", http.Dir("./static"))
	//router.Static("/static", "static")

	router.Run(":" + port)
	//router.RunTLS(":8080", "/home/peter/ssl/leaf.pem", "/home/peter/ssl/leaf.key")
}
