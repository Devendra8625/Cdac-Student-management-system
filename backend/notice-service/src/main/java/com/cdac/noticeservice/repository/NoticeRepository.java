package com.cdac.noticeservice.repository;

import com.cdac.noticeservice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
