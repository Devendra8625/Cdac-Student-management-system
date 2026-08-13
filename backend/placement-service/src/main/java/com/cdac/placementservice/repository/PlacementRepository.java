package com.cdac.placementservice.repository;

import com.cdac.placementservice.entity.Placement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlacementRepository extends JpaRepository<Placement, Long> {
}
