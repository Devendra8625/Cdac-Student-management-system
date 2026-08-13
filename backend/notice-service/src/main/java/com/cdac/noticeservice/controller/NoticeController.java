package com.cdac.noticeservice.controller;

import com.cdac.noticeservice.entity.Notice;
import com.cdac.noticeservice.repository.NoticeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Notice> addNotice(@RequestBody Notice notice) {
        Notice saved = noticeRepository.save(notice);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        return noticeRepository.findById(id)
                .map(notice -> {
                    noticeRepository.delete(notice);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
