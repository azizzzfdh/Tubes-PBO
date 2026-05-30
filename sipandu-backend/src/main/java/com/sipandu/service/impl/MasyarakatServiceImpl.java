package com.sipandu.service.impl;

import com.sipandu.dto.request.MasyarakatRequest;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.Masyarakat;
import com.sipandu.repository.MasyarakatRepository;
import com.sipandu.service.MasyarakatService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasyarakatServiceImpl implements MasyarakatService {

    private final MasyarakatRepository masyarakatRepository;

    public MasyarakatServiceImpl(MasyarakatRepository masyarakatRepository) {
        this.masyarakatRepository = masyarakatRepository;
    }

    @Override
    public List<Masyarakat> getAll() {
        return masyarakatRepository.findAll();
    }

    @Override
    public Masyarakat getById(Long id) {
        return masyarakatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Masyarakat tidak ditemukan"));
    }

    @Override
    public Masyarakat create(MasyarakatRequest request) {
        Masyarakat masyarakat = new Masyarakat();
        masyarakat.setNama(request.getNama());
        masyarakat.setEmail(request.getEmail());
        masyarakat.setPassword(request.getPassword());
        masyarakat.setNoHp(request.getNoHp());
        masyarakat.setAlamat(request.getAlamat());
        return masyarakatRepository.save(masyarakat);
    }

    @Override
    public Masyarakat update(Long id, MasyarakatRequest request) {
        Masyarakat masyarakat = getById(id);
        masyarakat.setNama(request.getNama());
        masyarakat.setEmail(request.getEmail());
        masyarakat.setPassword(request.getPassword());
        masyarakat.setNoHp(request.getNoHp());
        masyarakat.setAlamat(request.getAlamat());
        return masyarakatRepository.save(masyarakat);
    }

    @Override
    public void delete(Long id) {
        Masyarakat masyarakat = getById(id);
        masyarakatRepository.delete(masyarakat);
    }
}