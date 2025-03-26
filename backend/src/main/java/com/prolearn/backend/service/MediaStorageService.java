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
public class MediaStorageService {

    private final Path mediaStorageLocation;

    public MediaStorageService(@Value("${media.upload-dir:./uploads/media}") String uploadDir) {
        this.mediaStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.mediaStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores a file and returns the generated filename
     */
    public String storeMedia(MultipartFile file) {
        // Normalize file name
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "media_" + System.currentTimeMillis();
        } else {
            originalFilename = StringUtils.cleanPath(originalFilename);
        }
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence: " + originalFilename);
            }
            
            // Generate unique filename
            String fileExtension = getFileExtension(originalFilename);
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Copy file to the target location
            Path targetLocation = this.mediaStorageLocation.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFilename;
        } catch (IOException ex) {
            throw new FileStorageException("Failed to store file " + originalFilename, ex);
        }
    }

    /**
     * Deletes a file by its filename
     */
    public void deleteMedia(String filename) {
        try {
            Path filePath = this.mediaStorageLocation.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Failed to delete file " + filename, ex);
        }
    }

    /**
     * Gets the file path by filename
     */
    public Path getMediaPath(String filename) {
        return this.mediaStorageLocation.resolve(filename).normalize();
    }
    
    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex);
    }
}