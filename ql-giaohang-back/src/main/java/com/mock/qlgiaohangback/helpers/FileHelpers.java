package com.mock.qlgiaohangback.helpers;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.exception.ResponseException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class FileHelpers {

    private static final Path CURRENT_FOLDER = Paths.get(System.getProperty("user.dir")).resolve(Paths.get("static"));

    public static String saveImage(MultipartFile image, String prefixPath) throws IOException {
        Path imagePath = Paths.get("images");

        Path rootPath = CURRENT_FOLDER
                .resolve(imagePath)
                .resolve(prefixPath);


        if (!Files.exists(rootPath)) {
            Files.createDirectories(rootPath);
        }

        String extension = image.getOriginalFilename().split("\\.")[1];

        String imageName = UUID.randomUUID().toString() + "." + extension;

//        System.out.println(Filename);

        try (OutputStream os = Files.newOutputStream(rootPath.resolve(imageName))) {
            os.write(image.getBytes());
        }

        return imageName;
    }

    public static Resource loadImage(String fileName, String prefixPath) {
        Path imagePath = Paths.get("images");

        Path rootPath = CURRENT_FOLDER
                .resolve(imagePath)
                .resolve(prefixPath).resolve(fileName).normalize();

        try {
            Resource resource = new UrlResource(rootPath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new ResponseException("File not found " + fileName, HttpStatus.BAD_REQUEST, Constans.Code.INVALID.getCode());
            }

        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

    }
}
