package com.prolearn.backend.service;

import com.prolearn.backend.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "file_" + System.currentTimeMillis();
        } else {
            originalFilename = StringUtils.cleanPath(originalFilename);
        }
        
        try {
            // Check if the file's name contains invalid characters
            if(originalFilename.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }
            
            // Generate unique filename to prevent overwriting existing files
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFilename;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }
}