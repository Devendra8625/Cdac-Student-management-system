package com.cdac.placementservice.controller;

import com.cdac.placementservice.entity.Placement;
import com.cdac.placementservice.repository.PlacementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement")
public class PlacementController {

    private final PlacementRepository placementRepository;

    public PlacementController(PlacementRepository placementRepository) {
        this.placementRepository = placementRepository;
    }

    @GetMapping
    public List<Placement> getAllPlacements() {
        return placementRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Placement> addPlacement(@RequestBody Placement placement) {
        if (placement.getStatus() == null) {
            placement.setStatus("Active");
        }
        Placement saved = placementRepository.save(placement);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlacement(@PathVariable Long id) {
        return placementRepository.findById(id)
                .map(placement -> {
                    placementRepository.delete(placement);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
